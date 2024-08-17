import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
    token = `Bearer ${newToken}`;
};

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then((response) => response.data);
};

const create = async (newObject) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.post(baseUrl, newObject, config);
    return res.data;
};

const addLike = async (id, newObject) => {
    const config = {
        headers: { Authorization: token },
    };

    const req = axios.put(`${baseUrl}/like/${id}`, newObject, config);
    return req.then((res) => res.data);
};

const remove = async (id) => {
    const config = {
        headers: { Authorization: token },
    };

    const req = axios.delete(`${baseUrl}/${id}`, config);
    return req.then((res) => res.data);
};

export default { getAll, setToken, create, addLike, remove };
