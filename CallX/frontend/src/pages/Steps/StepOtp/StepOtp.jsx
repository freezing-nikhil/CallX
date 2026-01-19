import React, { useState } from 'react';
import Card from '../../../components/shared/Card/Card';
import TextInput from '../../../components/shared/TextInput/TextInput';
import Button from '../../../components/shared/Button/Button';
import styles from './StepOtp.module.css';
import { verifyOtp } from '../../../http';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../../../store/authSlice';

const StepOtp = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const { phone, email, hash } = useSelector((state) => state.auth.otp);

    async function submit() {
        if (!otp || otp.length !== 4) {
            setError('Please enter a valid 4-digit OTP');
            return;
        }

        if (!hash) {
            setError('OTP expired. Please request again.');
            return;
        }

        try {
            const payload = { otp, hash };

            if (phone) payload.phone = phone;
            if (email) payload.email = email;

            const { data } = await verifyOtp(payload);

            dispatch(setAuth(data));
        } catch (err) {
            setError('Invalid or expired OTP');
            console.log(err);
        }
    }

    return (
        <div className={styles.cardWrapper}>
            <Card title="Enter the 4-digit code" icon="lock">
                <TextInput
                    value={otp}
                    onChange={(e) => {
                        // allow numbers only
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                            setOtp(value);
                            setError('');
                        }
                    }}
                    placeholder="1234"
                />

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.actionButtonWrap}>
                    <Button onClick={submit} text="Next" />
                </div>

                <p className={styles.bottomParagraph}>
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </Card>
        </div>
    );
};

export default StepOtp;
