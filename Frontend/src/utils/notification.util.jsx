// utils/notification.util.js
import toast from "react-hot-toast";

// Optional: Add a subtle notification sound path
const notificationSound = new Audio("./sounds/notification.mp3");

export const triggerNotification = (senderName, messageText, avatarUrl) => {
  // 1. Play audio chime
  notificationSound.play().catch(() => {console.error("error while playing sound notification")});

  // 2. Trigger In-App Custom Toast Notification
  // console.log("In the triggereNOtification ",senderName,messageText,avatarUrl)
 toast.custom((t) => 
  {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black/5 p-3`}
    >
      <div className="flex-1 w-0 flex items-center gap-3">
        <img
          className="h-10 w-10 rounded-full object-cover border border-slate-100 flex-shrink-0"
          src={avatarUrl || "/default-avatar.png"}
          alt={senderName}
        />
        <div className="flex-col min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#111827] truncate">
            {senderName}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 truncate">
            {messageText}
          </p>
        </div>
      </div>
      <div className="flex border-l border-slate-100 ml-3 pl-3 items-center">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-xs font-semibold text-[#FF2D78] hover:text-[#e02266] focus:outline-none"
        >
          Close
        </button>
      </div>
    </div> 
  );
},{duration:1000});

  // 3. Trigger System Desktop Notification (If window is unfocused/minimized)
  if (Notification.permission === "granted" && document.hidden) {
    new Notification(`New message from ${senderName}`, {
      body: messageText,
      icon: avatarUrl || "/avatar.png",
    });
  }
};

// Request desktop system authorization early in app initialization lifecycle
export const requestNotificationPermission = async () => {
  if ("Notification" in window && Notification.permission === "default") {
    await Notification.requestPermission();
  }
};