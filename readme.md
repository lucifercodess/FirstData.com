backend/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── config/
├── utils/
├── index.js


frontend/
├── src/
    ├── components/
    ├── pages/
    ├── context/
    ├── hooks/
    ├── utils/
    ├── styles/
    ├── App.js
    ├── index.js

User Controllers
User Registration Controller - Handles user signup.
User Login Controller - Manages user authentication.
Profile Controller - Allows users to view and update their profile.
Profile Picture Controller - Manages profile picture uploads.
Account Settings Controller - Handles privacy and account settings.
Match Controllers
Discover Matches Controller - Fetches potential matches for users.
Like/Dislike Controller - Handles user likes/dislikes.
Match Controller - Manages match creation when both users like each other.
Chat Controllers
Chat Creation Controller - Initializes chat between matched users.
Message Controller - Sends, receives, and stores chat messages.
Chat History Controller - Retrieves chat histories.
Notification Controllers
Notification Controller - Sends match or message notifications.
Feed Controllers
Post Controller - Allows users to create posts or updates.
Like/Comment Controller - Handles likes and comments on posts.
Feed Controller - Fetches user-specific content for their feed.
Admin Controllers
User Management Controller - Allows admins to view and manage users.
Reports Controller - Handles user-reported content or behavior.
Analytics Controller - Provides insights into app usage.
Search and Discovery Controllers
Search Controller - Allows users to search for others by name or criteria.
Filter Controller - Applies filters like location, interests, etc., during discovery.
Security and Verification Controllers
Password Reset Controller - Handles forgot/reset password workflows.
Email/Phone Verification Controller - Manages OTP-based user verification.
Block/Report Controller - Allows users to block or report others.
Subscription and Payment Controllers
Subscription Controller - Manages premium subscriptions.
Payment Controller - Handles payment transactions for subscriptions.
Preferences Controllers
User Preferences Controller - Manages user preferences for matches (age, gender, location, etc.).
Interest Controller - Manages user interests and hobbies.
Feedback Controllers
Feedback Controller - Handles user feedback on the app experience.