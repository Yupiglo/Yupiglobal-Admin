import { useState, useRef, useEffect } from "react";

const OtpInput = ({
  length = 6,
  onOtpSubmit,
}: {
  length?: number;
  onOtpSubmit?: (otp: string) => void;
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const uniqueKeys = useRef<string[]>([]);

  // Ensure unique keys are generated once
  useEffect(() => {
    if (uniqueKeys.current.length !== length) {
      uniqueKeys.current = Array.from({ length }, () => crypto.randomUUID());
    }
  }, [length]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus(); // Move to next input
    }

    const fullOtp = newOtp.join("");
    if (fullOtp.length === length && onOtpSubmit) {
      onOtpSubmit(fullOtp);
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Move to previous input
    }
  };

  return (
    <div className="w-full flex flex-row justify-evenly gap-8 md:gap-4">
      {otp.map((digit, index) => {
        const key = uniqueKeys.current[index] || `otp-${index}`;
        return (
          <input
            key={key} // ✅ Ensured key is always defined
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            value={digit}
            maxLength={1}
            className="w-12 md:w-8 h-10 text-center border-b-2 bg-customInputBackground border-gray-400 focus:outline-none focus:border-gray-400 text-lg"
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        );
      })}
    </div>
  );
};

export default OtpInput;
