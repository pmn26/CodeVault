import React from "react";
import "../assets/userprofile.css";

function UserProfile() {
  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>

      <form className="user-profile-form">
        {/* Name */}
        <div className="form-group">
          <label>Your Name</label>
          <input type="text" placeholder="Enter your name" />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" />
        </div>

        {/* Passwords */}
        <div className="form-row">
          <div className="form-group half">
            <label>Current Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <div className="form-group half">
            <label>New Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" placeholder="••••••••" />
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button type="button" className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserProfile;
