export const statusValidation = (req, res, next) => {
    const validStatuses = ['Pending', 'Accepted', 'InProgress', 'Completed', 'Cancelled', 'Rescheduled'];
    const { status } = req.params;
    console.log("Status:", status);
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid booking status" });
    }

    next();
};
