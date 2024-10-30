import { useState, useCallback, useRef } from "react";
import Pusher from "pusher-js";

const useClipboardManager = (data) => {
  const [clipboards, setClipboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const pusherRef = useRef(null);
  const channelRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  const initializePusher = useCallback(() => {
    // Initialize Pusher
    pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true,
      authEndpoint: "/api/pusher/auth",
    });

    // Subscribe to user-specific channel
    const channelName = `private-user-${data.user.id}`;
    channelRef.current = pusherRef.current.subscribe(channelName);

    // Listen for clipboard updates
    channelRef.current.bind("clipboard-update", (newClipboard) => {
      setClipboards((prevClipboards) => {
        const exists = prevClipboards.some((cb) => cb._id === newClipboard._id);
        if (exists) {
          return prevClipboards.map((cb) =>
            cb._id === newClipboard._id ? newClipboard : cb
          );
        }
        return [newClipboard, ...prevClipboards];
      });
    });

    // Listen for clipboard deletions
    channelRef.current.bind("delete_copy", (deletedCopy) => {
      setClipboards((prevClipboards) =>
        prevClipboards.filter((cb) => cb._id !== deletedCopy.clipboardId)
      );
    });

    // Handle connection errors
    pusherRef.current.connection.bind("error", (error) => {
      console.error("Pusher connection error:", error);
    });

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        pusherRef.current.unsubscribe(channelName);
      }
      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
    };
  }, [data?.user?.id]);

  const fetchClipboards = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/clipboard/get?page=${page}&limit=${itemsPerPage}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setClipboards(data.clipboards);
          setTotalPages(Math.ceil(data.total / itemsPerPage));
          setCurrentPage(page);
        }
      } catch (error) {
        console.error("Failed to fetch clipboards:", error);
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      fetchClipboards(newPage);
    },
    [fetchClipboards]
  );

  const copyTheClipboardContent = useCallback(async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      alert("Save clipboard content");
    } catch (error) {
      console.error("Failed to copy clipboard item:", error);
    }
  });

  return {
    clipboards,
    loading,
    copyTheClipboardContent,
    currentPage,
    totalPages,
    itemsPerPage,
    fetchClipboards,
    handlePageChange,
    initializePusher, // Changed from initializeSocket to initializePusher
  };
};

export default useClipboardManager;
