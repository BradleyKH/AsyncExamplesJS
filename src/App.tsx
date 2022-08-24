import { useCallback, useEffect, useState } from "react";
import { Button, Container, Input } from "reactstrap";

export default function App() {
    const [timer, setTimer] = useState<number>(0);
    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    const [hasBegun, setHasBegun] = useState<boolean>(false);
    const beginStyle = "color: #08f";
    const stepStyle = "color: #ff0";
    const resultsStyle = "color: #080; font-weight: 700";

    const log = (msg: string | number, style: string = '') => style ? console.log(`%c${msg}`, style) : console.log(msg);

    useEffect(() => {
        if (timerRunning) {
            setTimer(new Date().getTime());
        }
    }, [timerRunning]);

    const getSeconds = useCallback(() => {
        const current = new Date().getTime();
        const difference = current - timer;
        return (difference / 1000).toFixed(3);
    }, [timer]);

    const numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const getRandomMilliseconds = (): number => {
        return Math.random() * 600;
    };

    const sleep = (ms: number): Promise<any> => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const printWithDelayAsync = async (number: number, msDelay: number): Promise<number> => {
        var seconds = (msDelay / 1000).toFixed(3);
        await sleep(msDelay);
        log(`Waiting ${seconds} seconds...`);
        log(number);
        return +seconds;
    };

    const example1 = async (letter: string): Promise<string> => {
        log(`Beginning example 1-${letter}...`, beginStyle);
        let totalSeconds = 0;
        for (let number of numbers) {
            totalSeconds += await printWithDelayAsync(number, getRandomMilliseconds());
        }
        log(
            `Example 1-${letter} complete. Total seconds: ${totalSeconds.toFixed(3)}`,
            stepStyle
        );
        return totalSeconds.toFixed(3);
    };

    const sequential = async () => {
        setHasBegun(true);
        setTimerRunning(true);
        const seconds1 = await example1("a");
        log(`Completed with result: ${seconds1}`, resultsStyle);
        const seconds2 = await example1("b");
        log(`Completed with result: ${seconds2}`, resultsStyle);
        setTimerRunning(false);
    };

    const parallel = async () => {
        setHasBegun(false);
        example1("a");
        example1("b");
    };

    const parallelWithTimer = async () => {
        setHasBegun(true);
        setTimerRunning(true);
        //debugger;
        const results = await Promise.all([example1("a"), example1("b")]);
        const [result1, result2] = results;
        log(`Completed with results: ${result1}, ${result2}`, resultsStyle);
        setTimerRunning(false);
    };

    const example2 = async (letter: string): Promise<string> => {
        log(`Beginning example 2-${letter}...`, beginStyle);
        let totalSeconds = 0;
        let promises: Promise<number>[] = [];
        for (let number of numbers) {
            promises.push(printWithDelayAsync(number, getRandomMilliseconds()));
        }
        const results = await Promise.all(promises);
        //debugger;
        for (let result of results) {
            totalSeconds += result;
        }
        log(
            `Example 2-${letter} complete. Total seconds: ${totalSeconds.toFixed(3)}`,
            stepStyle
        );
        return totalSeconds.toFixed(3);
    };

    const superParallel = async () => {
        setHasBegun(true);
        setTimerRunning(true);
        const results = await Promise.all([example2("a"), example2("b")]);
        const [result1, result2] = results;
        log(`Completed with results: ${result1}, ${result2}`, resultsStyle);
        setTimerRunning(false);
    };

    return (
        <Container className="text-center p-5 d-flex flex-column align-items-center">
            <h1 className="mb-5">Async Examples</h1>
            <div className="d-flex">
                {hasBegun && (
                    <Input value={timerRunning ? "timer running..." : getSeconds()} readOnly />
                )}
                {hasBegun && !timerRunning && (
                    <Button
                        className="ms-2"
                        size="sm"
                        color="secondary"
                        onClick={() => setHasBegun(false)}
                    >
                        &times;
                    </Button>
                )}
            </div>
            <Button color="primary" className="m-3" onClick={sequential}>
                Sequential
            </Button>
            <Button color="primary" className="m-3" onClick={parallel}>
                Parallel
            </Button>
            <Button color="primary" className="m-3" onClick={parallelWithTimer}>
                Parallel - Await All
            </Button>
            <Button color="primary" className="m-3" onClick={superParallel}>
                Parallel - Best
            </Button>
        </Container>
    );
}
