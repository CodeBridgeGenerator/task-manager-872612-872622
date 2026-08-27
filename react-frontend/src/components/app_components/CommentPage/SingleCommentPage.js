import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { SplitButton } from "primereact/splitbutton";
import client from "../../../services/restClient";
import CommentsSection from "../../common/CommentsSection";
import ProjectLayout from "../../Layouts/ProjectLayout";


const SingleCommentPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState({});
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

    const [author, setAuthor] = useState([]);
const [parentComment, setParentComment] = useState([]);
const [task, setTask] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("comment")
            .get(urlParams.singleCommentId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"author","parentComment","task"] }})
            .then((res) => {
                set_entity(res || {});
                const author = Array.isArray(res.author)
            ? res.author.map((elem) => ({ _id: elem._id, displayName: elem.displayName }))
            : res.author
                ? [{ _id: res.author._id, displayName: res.author.displayName }]
                : [];
        setAuthor(author);
const parentComment = Array.isArray(res.parentComment)
            ? res.parentComment.map((elem) => ({ _id: elem._id, content: elem.content }))
            : res.parentComment
                ? [{ _id: res.parentComment._id, content: res.parentComment.content }]
                : [];
        setParentComment(parentComment);
const task = Array.isArray(res.task)
            ? res.task.map((elem) => ({ _id: elem._id, title: elem.title }))
            : res.task
                ? [{ _id: res.task._id, title: res.task.title }]
                : [];
        setTask(task);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Comment", type: "error", message: error.message || "Failed get comment" });
            });
    }, [props,urlParams.singleCommentId]);


    const goBack = () => {
        navigate("/app/comment");
    };

      const toggleHelpSidebar = () => {
    setHelpSidebarVisible(!isHelpSidebarVisible);
  };

  const copyPageLink = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        props.alert({
          title: "Link Copied",
          type: "success",
          message: "Page link copied to clipboard!",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        props.alert({
          title: "Error",
          type: "error",
          message: "Failed to copy page link.",
        });
      });
  };

    const menuItems = [
        {
            label: "Copy link",
            icon: "pi pi-copy",
            command: () => copyPageLink(),
        },
        {
            label: "Help",
            icon: "pi pi-question-circle",
            command: () => toggleHelpSidebar(),
        },
    ];

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-12">
                <div className="flex align-items-center justify-content-between">
                <div className="flex align-items-center">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Comment</h3>
                    <SplitButton
                        model={menuItems.filter(
                        (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                        )}
                        dropdownIcon="pi pi-ellipsis-h"
                        buttonClassName="hidden"
                        menuButtonClassName="ml-1 p-button-text"
                    />
                </div>
                
                {/* <p>comment/{urlParams.singleCommentId}</p> */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Content</label><p className="m-0 ml-3" >{_entity?.content}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Created Date</label><p id="createdDate" className="m-0 ml-3" >{_entity?.createdDate}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Attachment</label><p className="m-0 ml-3" >{_entity?.attachment}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Author</label>
                    {author.map((elem) => (
                        <Link key={elem._id} to={`/users/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.displayName}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Parent Comment</label>
                    {parentComment.map((elem) => (
                        <Link key={elem._id} to={`/comment/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.content}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-gray-600">Task</label>
                    {task.map((elem) => (
                        <Link key={elem._id} to={`/task/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.title}</p>
                            </div>
                        </Link>
                    ))}</div>

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
         </div>

      


      <CommentsSection
        recordId={urlParams.singleCommentId}
        user={props.user}
        alert={props.alert}
        serviceName="comment"
      />
      <div
        id="rightsidebar"
        className={classNames("overlay-auto z-1 surface-overlay shadow-2 absolute right-0 w-20rem animation-duration-150 animation-ease-in-out", { "hidden" : !isHelpSidebarVisible })}
        style={{ top: "60px", height: "calc(100% - 60px)" }}
      >
        <div className="flex flex-column h-full p-4">
          <span className="text-xl font-medium text-900 mb-3">Help bar</span>
          <div className="border-2 border-dashed surface-border border-round surface-section flex-auto"></div>
        </div>
      </div>
      </div>
        </ProjectLayout>
    );
};

const mapState = (state) => {
    const { user, isLoggedIn } = state.auth;
    return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleCommentPage);
