import React, { useState, useEffect } from "react";
import styles from "./ErrorWindow.module.css";

const errors = ["", "失敗！", "失敗失敗！", "残念！"];

type Point = {
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex: number;
};

const genP = (i: number) => {
  const p: Point = {
    left: Math.random() * 100,
    top: Math.random() * 100,
    width: 100 + Math.random() * 150,
    height: 100 + Math.random() * 150,
    zIndex: i,
  };
  return p;
};

const ErrorWindow: React.FC = () => {
  const [pointList, setPointList] = useState<Point[]>(
    Array.from({ length: 1 }, (_, i) => genP(i + 1))
  );
  const [password, setPassword] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

  const closeWindow = (index: number) => {
    setPointList(pointList.filter((_, i) => i !== index));
  };
  useEffect(() => {
    const delTimer = setInterval(() => {
      if (!success || pointList.length < 1) {
        clearInterval(delTimer);
        return;
      }
      const list = [...pointList, genP(pointList.length + 1)];
      setPointList(list.slice(2));
    }, 10);
    const addTimer = setInterval(() => {
      if (success) {
        clearInterval(addTimer);
        return;
      }
      let list = [...pointList, genP(pointList.length + 1)];
      if (pointList.length > 1000) {
        list = list.slice(2);
      }
      setPointList(list);
    }, 10);

    return () => {
      clearInterval(addTimer);
      clearInterval(delTimer);
    };
  }, [pointList.length]);
  useEffect(() => {
    if (counter >= errors.length) {
      setSuccess(true);
      return;
    }
  }, [counter]);

  return (
    <div className={styles.errorContainer}>
      {pointList.map((p, index) => (
        <div
          key={index}
          className={styles.errorWindow}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            zIndex: index + 1,
          }}
        >
          <div className={styles.errorTitleBar}>
            <button
              className={styles.errorCloseButton}
              onClick={() => closeWindow(index)}
            >
              ☓
            </button>
          </div>
          <div className={styles.errorContent}>ERROR!</div>
        </div>
      ))}
      <div
        className={styles.passwordForm}
        style={{ zIndex: pointList.length + 10 }}
      >
        <div className={styles.formBody}>
          <div>{success ? "成功！" : "パスワードを入力してください:"}</div>
          {!success && <div>{errors[counter]}</div>}
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(
                e.target.value.length > 20
                  ? e.target.value
                  : e.target.value.substring(0, 19)
              );
              console.log(pointList.slice(10));
              setPointList([...pointList.slice(2)]);
            }}
          />
          <div className={styles.formFooter}>
            <div>
              <button
                onClick={() => {
                  setPassword("");
                  setCounter(counter + 1);
                }}
              >
                submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorWindow;
