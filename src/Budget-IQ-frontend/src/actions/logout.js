import { redirect } from "react-router-dom";
import { deleteItem } from "../helpers";
import { toast } from "react-toastify";

export async function loggedoutAction(){
    //delete or remove user
    deleteItem({
        key: "userName"
    })
    toast.success("Account deleted") //this should be based on the response in the backend.
    //redirect
    return redirect("/")
}