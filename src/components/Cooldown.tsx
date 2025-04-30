import { useEffect, useState } from 'react';

export default function Cooldown({ duration = 5, active = false, onDone }: { duration?: number; active?: boolean; onDone?: () => void }) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (!active) {
            setTimeLeft(duration);
            return;
        }
        setTimeLeft(duration);
        if (duration <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onDone && onDone();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [active, duration, onDone]);

    if (!active) return null;
    return (
        <span className="text-xs text-blue-600 dark:text-blue-300 ml-2">Cooldown: {timeLeft}s</span>
    );
}