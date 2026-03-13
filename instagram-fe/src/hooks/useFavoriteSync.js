import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import userService from "../services/userService";

const useFavoriteSync = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user?.id && !user.favoriteUserIds) {
            userService
                .getFavoriteUsers()
                .then((res) => {
                    const data = res?.data || res;
                    const list = Array.isArray(data)
                        ? data
                        : data?.content || [];
                    const favoriteUserIds = list.map((u) => u.id);

                    dispatch(
                        setUser({
                            ...user,
                            favoriteUserIds: favoriteUserIds,
                        }),
                    );
                })
                .catch(console.error);
        }
    }, [dispatch, isAuthenticated, user?.id, user?.favoriteUserIds]);
};

export default useFavoriteSync;
