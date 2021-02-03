export const parser = (data: string): Record<string, string> => {
    const headers: string[] = data.split('\r\n');

    return headers.reduce((prev: Record<string, string>, current: string) => {
        const [key, value] = current.split(':');
        if (value) {
            prev[key] = value.trim();
        }

        return prev;
    }, {});
};

export const parseActionToString = (action: Record<string, string>): string => {
    const parsedAction: string = Object.entries(action).reduce((prev: string, element: [string, string]) => {
        return prev + `${element[0]}: ${element[1]}\r\n`;
    }, '');

    return parsedAction.concat('\r\n');
};
