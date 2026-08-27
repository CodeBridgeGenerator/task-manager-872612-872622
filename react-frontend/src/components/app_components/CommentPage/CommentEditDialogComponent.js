/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const CommentEditDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [author, setAuthor] = useState([])
const [parentComment, setParentComment] = useState([])
const [task, setTask] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount users
                    client
                        .service("users")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleUsersId } })
                        .then((res) => {
                            setAuthor(res.data.map((e) => { return { name: e['displayName'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Users", type: "error", message: error.message || "Failed get users" });
                        });
                }, []);
 useEffect(() => {
                    //on mount comment
                    client
                        .service("comment")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleCommentId } })
                        .then((res) => {
                            setParentComment(res.data.map((e) => { return { name: e['content'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Comment", type: "error", message: error.message || "Failed get comment" });
                        });
                }, []);
 useEffect(() => {
                    //on mount task
                    client
                        .service("task")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleTaskId } })
                        .then((res) => {
                            setTask(res.data.map((e) => { return { name: e['title'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.debug({ error });
                            props.alert({ title: "Task", type: "error", message: error.message || "Failed get task" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            author: _entity?.author?._id,
content: _entity?.content,
createdDate: _entity?.createdDate,
attachment: _entity?.attachment,
parentComment: _entity?.parentComment?._id,
task: _entity?.task?._id,
        };

        setLoading(true);
        try {
            
        await client.service("comment").patch(_entity._id, _data);
        const eagerResult = await client
            .service("comment")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "author",
                    service : "users",
                    select:["displayName"]},{
                    path : "parentComment",
                    service : "comment",
                    select:["content"]},{
                    path : "task",
                    service : "task",
                    select:["title"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info comment updated successfully" });
        props.onEditResult(eagerResult.data[0]);
        } catch (error) {
            console.debug("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const authorOptions = author.map((elem) => ({ name: elem.name, value: elem.value }));
const parentCommentOptions = parentComment.map((elem) => ({ name: elem.name, value: elem.value }));
const taskOptions = task.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Comment" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="comment-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="author">Author:</label>
                <Dropdown id="author" value={_entity?.author?._id} optionLabel="name" optionValue="value" options={authorOptions} onChange={(e) => setValByKey("author", {_id : e.value})}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["author"]) && (
              <p className="m-0" key="error-author">
                {error["author"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="content">Content:</label>
                <InputTextarea id="content" rows={5} cols={30} value={_entity?.content} onChange={ (e) => setValByKey("content", e.target.value)} autoResize  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["content"]) && (
              <p className="m-0" key="error-content">
                {error["content"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="createdDate">Created Date:</label>
                <Calendar id="createdDate" value={_entity?.createdDate ? new Date(_entity?.createdDate) : null} onChange={ (e) => setValByKey("createdDate", new Date(e.value))} showIcon showButtonBar  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["createdDate"]) && (
              <p className="m-0" key="error-createdDate">
                {error["createdDate"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="attachment">Attachment:</label>
                <InputTextarea id="attachment" rows={5} cols={30} value={_entity?.attachment} onChange={ (e) => setValByKey("attachment", e.target.value)} autoResize  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["attachment"]) && (
              <p className="m-0" key="error-attachment">
                {error["attachment"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="parentComment">Parent Comment:</label>
                <Dropdown id="parentComment" value={_entity?.parentComment?._id} optionLabel="name" optionValue="value" options={parentCommentOptions} onChange={(e) => setValByKey("parentComment", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["parentComment"]) && (
              <p className="m-0" key="error-parentComment">
                {error["parentComment"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="task">Task:</label>
                <Dropdown id="task" value={_entity?.task?._id} optionLabel="name" optionValue="value" options={taskOptions} onChange={(e) => setValByKey("task", {_id : e.value})}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["task"]) && (
              <p className="m-0" key="error-task">
                {error["task"]}
              </p>
            )}
          </small>
            </div>
                <div className="col-12">&nbsp;</div>
                <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(CommentEditDialogComponent);
