import React, { useState } from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css';
import { sendOtp } from '../../../../http';
import { useDispatch } from 'react-redux';
import { setOtp } from '../../../../store/authSlice';

const Email = ({ onNext }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    async function submit() {
        if (!email) {
            setError('Email is required');
            return;
        }

        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setError('');

        const { data } = await sendOtp({ email });

        dispatch(
            setOtp({
                email: data.email,
                hash: data.hash,
            })
        );

        onNext();
    }

    return (
        <Card title="Enter your email id" icon="email">
            <TextInput
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                }}
                placeholder="example@gmail.com"
            />

            {error && <p className={styles.error}>{error}</p>}

            <div>
                <div className={styles.actionButtonWrap}>
                    <Button text="Next" onClick={submit} />
                </div>

                <p className={styles.bottomParagraph}>
                    By entering your email, you’re agreeing to our Terms of
                    Service and Privacy Policy. Thanks!
                </p>
            </div>
        </Card>
    );
};

export default Email;
