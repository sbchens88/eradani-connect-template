async function getJoke(reqFields) {
    // call web service
    let result;
    try {
        result = await axiosInstance.get("/jokes/random", {
            params: reqFields
        });

        // create outgoing data buffer
        result.data.value.httpstatus = result.status.toString();
        return result.data.value;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getJoke
};