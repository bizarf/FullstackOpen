const Notification = ({ notificationClass, message }) => {
    if (message === null) {
        return null;
    }

    return <div className={notificationClass}>{message}</div>;
};

export default Notification;
