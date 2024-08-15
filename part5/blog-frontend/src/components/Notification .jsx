const Notification = ({ notification }) => {
    if (notification === null) {
        return null;
    }
    return (
        <>
            {notification.type === "error" ? (
                <div className="error">{notification.message}</div>
            ) : (
                <div className="success">{notification.message}</div>
            )}
        </>
    );
};

export default Notification;
