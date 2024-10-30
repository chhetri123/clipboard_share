import { useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";

const useClipboardManager = (data) => {
  const [clipboards, setClipboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  const initializeSocket = useCallback(() => {
    // Create socket connection
    socketRef.current = io(
      {
        path: "/api/socket",
      },
      {
        transports: ["polling", "websocket"],
        reconnectionAttempts: 10,
        reconnectionDelay: 5000,
        autoConnect: false,
      }
    );

    // Join user-specific room
    socketRef.current.emit("join-room", data.user.id);

    // Listen for clipboard updates
    socketRef.current.on("clipboard-update", (newClipboard) => {
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

    socketRef.current.on("delete_copy", (deletedCopy) => {
      setClipboards((prevClipboards) =>
        prevClipboards.filter((cb) => cb._id !== deletedCopy.clipboardId)
      );
    });
    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
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
    initializeSocket,
  };
};

export default useClipboardManager;
