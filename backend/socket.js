let ioRef = null;

export const setIO = (io) => {
  ioRef = io;
};

export const getIO = () => ioRef;
