import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        // useForm is functionality from react-hook-form 
        // the default value I want to give which will be used while working with above method like register and all
        
        defaultValues: {
            // if I want to edit then I will need the default previous data to edit and if I want to add then it should be empty
            // that is what below code says if exist then show or else show ''
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    // this userData below comes from store or config created using reduxToolKit 
    // useSelector gets us access to present data inside the initial state 
    // If I want to edit or modify the data then I will use useDispatch 
    const userData = useSelector((state) => state.auth.userData);

    //  this is the functionality for button of uploading or updating a post
    const submit = async (data) => {
        // the data will be that data of particular post which we are going to edit or update
        // first check post exist or not if exits then perform the updation operation or the process of creating post operation
        if (post) {
            // If image exist in data then use the function from the appwriteService of uploadfile 
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            // If there is already a file in the database so it should be updated means, deleted and and then uploaded 
            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            // when the updation (when user edits or creates and click on submit ) is done then why the user has to stay in old page having previous data 
            // So using useNavigate from 'react-router-dom' take the user to the page of updated blog view
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                // So using useNavigate from 'react-router-dom' take the user to the page of updated blog view
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };
    // slugTransform jobs is to convert a "hello guys" to "hello-guys" basically adding a '-' instead of space between title
    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                // replace and inner content regex used to convert space between to '-'
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        // the watch function from useCallback watches if there is change in given value(user typed in title section)
        // and the {name}(is one of the field of useCallback) 
        const subscription = watch((value, { name }) => {
            // bascially it watchs all the field but when name==='title' then set the 'slug' field with slugTransform(value.title)
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });
        // when the component unmounts (or dependencies change), remove the subscription so you don’t leak memory or trigger callbacks after unmount.
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        // when user clicks on submit button handleSubmit(submit) will run 
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    // Please watch this box called 'title' and make sure it's filled."
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
