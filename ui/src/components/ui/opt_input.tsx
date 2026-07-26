import { useState, useRef, useEffect } from 'react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

interface OtpInputProps {
    length?: number;
    onChange?: (otp: string) => void;
    error?: string;
    label?: string;
    autoFocus?: boolean;
}

const OtpInput = ({ 
    length = 4, 
    onChange, 
    error,
    label = 'کد تایید',
    autoFocus = true 
}: OtpInputProps) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    const handleChange = (index: number, value: string) => {
        // فقط اعداد را قبول کند
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // فقط آخرین کاراکتر
        setOtp(newOtp);

        // اگر مقدار وارد شد، به اینپوت بعدی برو
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // اگر همه پر شدند، callback را صدا بزن
        const otpString = newOtp.join('');
        if (onChange) {
            onChange(otpString);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // اگر خالی بود، به اینپوت قبلی برگرد
                inputRefs.current[index - 1]?.focus();
            } else {
                // اینپوت فعلی را خالی کن
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
                if (onChange) {
                    onChange(newOtp.join(''));
                }
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
        
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split('');
        while (newOtp.length < length) {
            newOtp.push('');
        }
        
        setOtp(newOtp);
        
        // فوکوس را به آخرین اینپوت پر شده ببر
        const nextEmpty = Math.min(pastedData.length, length - 1);
        inputRefs.current[nextEmpty]?.focus();

        if (onChange) {
            onChange(newOtp.join(''));
        }
    };

    return (
        <div className="grid gap-2">
            <Label className="text-center">{label}</Label>
            <div className="flex gap-2 justify-center" dir="ltr">
                {Array.from({ length }).map((_, index) => (
                    <Input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]"
                        maxLength={1}
                        value={otp[index]}
                        className="w-14 h-14 text-center text-2xl"
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    />
                ))}
            </div>
            {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
            )}
        </div>
    );
};

export default OtpInput;