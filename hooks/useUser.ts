import { useToast } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../firebaseConfig";
import { User } from "../utils/types";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false)

    const toast = useToast();

    const fetchUsers = async () => {
        setLoading(true);

        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const usersData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as any;

            setUsers(usersData);
        } catch (error) {
            toast({
                title: 'Something went wrong!!!'
            })
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    return { users, loading, refetchUsers: fetchUsers }
}