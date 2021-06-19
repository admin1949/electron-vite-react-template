export const DesktopMsg = ({ title, ...opt }: NotificationOptions & { title: string}) => {
    const msgfunc = new Notification(title, opt);
    return new Promise(resolve => {
        msgfunc.onclick = resolve;
    });
}