import { Inngest } from "inngest";
import User from "../models/user.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "BUBT-connect" });

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    // Generate username from email
    let username = email_addresses[0].email_address.split("@")[0];

    // Check availability of username
    const userExists = await User.findOne({ username });
    if (userExists) {
      username = username + Math.floor(Math.random() * 10000);
    }

    // Prepare user data
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      full_name: first_name + " " + last_name,
      profile_picture: image_url,
      username,
    };

    // Save user to DB
    await User.create(userData);
  }
);
// Inngest Function to update user data in the database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" }, // Trigger event
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    // Prepare updated user data
    const updatedUserData = {
      email: email_addresses[0].email_address,
      full_name: first_name + " " + last_name,
      profile_picture: image_url,
    };

    // Update user in DB
    await User.findByIdAndUpdate(id, updatedUserData, { new: true });

    console.log(`User ${id} updated successfully`);
  }
);

// Inngest Function to delete user from the database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" }, // Trigger event
  async ({ event }) => {
    const { id } = event.data;

    // Delete user from DB
    await User.findByIdAndDelete(id);

    console.log(`User ${id} deleted successfully`);
  }
);

// Export all Inngest functions
export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];
