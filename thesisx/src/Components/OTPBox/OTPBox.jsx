import { useState } from 'react';

const OTPInput = ({ length = 6, onChange }) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return; // Only allow single digit numbers
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < length - 1) {
            // Move to next input
            document.getElementById(`otp-input-${index + 1}`).focus();
        }

        onChange(newOtp.join(''));
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Move to the previous input if empty and delete
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    return (
        <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center border border-[hsl(0,0,70%)] dark:border-[hsl(0,0,30%)] rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-[hsl(18,73%,52%)] dark:focus:ring-[hsl(18,73%,48%)] bg-white dark:bg-[hsl(0,0,10%)] text-black dark:text-white"
                />
            ))}
        </div>
    );
};

export default OTPInput;
