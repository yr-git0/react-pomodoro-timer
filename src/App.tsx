import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import styled from "styled-components";
import { roundState, goalState } from "./States";

const Wrapper = styled.div`
  width: 60vw;
  height: 100vh;
  flex-direction: column;
  justify-content: space-around;
`;

const Title = styled.span`
  font-size: 80px;
  text-shadow: 2px 2px 2px black;
`;

const Timer = styled.div`
  height: 350px;
`;

const Box = styled(motion.div)`
  width: 250px;
  height: 100%;
  color: #e44337;
  background-color: white;
  border-radius: 20px;
  font-size: 130px;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.3);
`;

const boxVariants = {
  start: {
    scale: 0.8,
  },
  end: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.8,
      bounce: 0.5,
    },
  },
};

const TransparentText = styled.div`
  font-size: 100px;
  opacity: 0.7;
  padding: 0px 10px 20px 10px;
  height: 100%;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);
`;

const Button = styled(motion.div)`
  width: 160px;
  height: 160px;
  position: relative;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  &:hover {
    scale: 1.2;
    cursor: pointer;
  }
`;

const buttonVariants = {
  start: {
    scale: 1.3,
  },
  end: {
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.5,
    },
  },
};

const Svg = styled.svg`
  width: 120px;
  height: 120px;
`;

const StateBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 130px;
  height: 110px;
  margin: 0 0 100px 0;
  text-shadow: 2px 2px 2px black;
`;

const State = styled.div`
  font-size: 35px;
  opacity: 0.6;
  align-items: flex-end;
`;

const StateName = styled.div`
  font-size: 28px;
  align-items: flex-start;
`;

const PlayButton = () => {
  return (
    <Svg
      style={{ paddingLeft: "13px" }}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
    </Svg>
  );
};

const PauseButton = () => {
  return (
    <Svg
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z"></path>
    </Svg>
  );
};

function App() {
  const MAX_ROUND = 4;
  const MAX_GOAL = 12;
  const START_MINUTE = "25";
  const START_SECOND = "00";

  const [minutes, setMinutes] = useState(START_MINUTE);
  const [seconds, setSeconds] = useState(START_SECOND);
  const [isPlay, setIsPlay] = useState(false);
  const [round, setRound] = useRecoilState(roundState);
  const [goal, setGoal] = useRecoilState(goalState);
  const resetRound = useResetRecoilState(roundState);
  const resetGoal = useResetRecoilState(goalState);

  const clearTimer = () => {
    setMinutes(START_MINUTE);
    setSeconds(START_SECOND);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPlay) {
        clearInterval(timer);
        return;
      }

      if (minutes === "00" && seconds === "01") {
        clearTimer();
        if (round == MAX_ROUND && goal == MAX_GOAL) {
          resetRound();
          resetGoal();
          setIsPlay(false);
          clearInterval(timer);
        } else if (round == MAX_ROUND) {
          resetRound();
          setGoal((goal) => goal + 1);
        } else {
          setRound((round) => round + 1);
        }
      } else if (seconds === "00") {
        setMinutes((prev) => (parseInt(prev) - 1).toString().padStart(2, "0"));
        setSeconds("59");
      } else {
        setSeconds((prev) => (parseInt(prev) - 1).toString().padStart(2, "0"));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [minutes, seconds, isPlay, round, goal]);

  return (
    <Wrapper>
      <Title>Pomodoro</Title>
      <Timer>
        <Box
          key={"min" + minutes}
          variants={boxVariants}
          initial="start"
          animate="end"
        >
          {minutes}
        </Box>
        <TransparentText>:</TransparentText>
        <Box
          key={"sec" + seconds}
          variants={boxVariants}
          initial="start"
          animate="end"
        >
          {seconds}
        </Box>
      </Timer>
      <Button
        onClick={() => setIsPlay((prev) => !prev)}
        key={isPlay ? "play" : "pause"}
        variants={buttonVariants}
        initial="start"
        animate="end"
      >
        {!isPlay ? <PlayButton /> : <PauseButton />}
      </Button>
      <StateBoard>
        <State>
          {round}/{MAX_ROUND}
        </State>
        <State>
          {goal}/{MAX_GOAL}
        </State>
        <StateName>ROUND</StateName>
        <StateName>GOAL</StateName>
      </StateBoard>
    </Wrapper>
  );
}

export default App;
