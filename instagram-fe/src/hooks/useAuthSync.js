import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../store/slices/authSlice";

const useAuthSync = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        // Trigger fetch if user is locally known or authenticated
        // to sync with backend httpOnly cookie session
        if (isAuthenticated || user) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, isAuthenticated, user?.id]);
};

export default useAuthSync;
