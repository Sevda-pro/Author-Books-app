const fs=require('fs');
const errorhandling = (err, req, res, next) => {
	const statusCode = err.statuscode || 500;
	fs.appendFile('error.log', `${new Date().toISOString()} -${statusCode}- ${err.message}\n`, (fileErr) => {
        if (fileErr) {
            console.error('Error writing to error.log:', fileErr);
        }
    });

	res.status(statusCode).json({ message: err.message, success: err.status })
};

module.exports = { errorhandling };