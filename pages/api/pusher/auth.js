"use server";

import Pusher from "pusher";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { socket_id, channel_name } = req.body;

  // Ensure the channel name matches the user's private channel
  const expectedChannelName = `private-user-${session.user.id}`;
  if (channel_name !== expectedChannelName) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const authResponse = pusher.authorizeChannel(socket_id, channel_name);
    res.send(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);
    res.status(500).json({ message: "Error authenticating channel" });
  }
}
