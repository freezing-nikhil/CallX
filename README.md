🚀 CallX – Real-Time Voice Conferencing App

CallX is a real-time voice conferencing platform built to deeply understand WebRTC internals, implement secure authentication, and enable low-latency peer-to-peer audio communication.

🎯 Aim

Understand WebRTC internals (ICE, SDP, signaling)

Implement stateless OTP authentication

Build secure token-based sessions

Solve real-time audio communication challenges

⚙️ Core Features

🔐 OTP Authentication

Login via Email or Phone

OTP delivery using Twilio (SMS/Email)

Stateless OTP validation (no OTP stored in database)

🔄 Secure Session Management

JWT + Refresh Tokens

Auto-login support up to 1 year

👤 User Onboarding

Profile setup only for first-time users

🎙️ Voice Conferencing

Real-time voice rooms

Low-latency P2P audio streaming using WebRTC

🔗 Signaling System

Socket.IO used for:

SDP exchange

ICE candidate sharing

Room events handling

🛠️ Tech Stack

Frontend:

HTML

CSS

JavaScript

React

Redux

Backend:

Node.js

Express.js

Database:

MongoDB

Real-Time & Communication:

WebRTC

Socket.IO

Third-Party Services:

Twilio (OTP delivery)

Testing & Tools:

Postman
