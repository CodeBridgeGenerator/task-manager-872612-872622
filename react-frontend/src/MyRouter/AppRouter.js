import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';

import SingleTaskPage from "../components/app_components/TaskPage/SingleTaskPage";
import TaskProjectLayoutPage from "../components/app_components/TaskPage/TaskProjectLayoutPage";
import SingleProjectPage from "../components/app_components/ProjectPage/SingleProjectPage";
import ProjectProjectLayoutPage from "../components/app_components/ProjectPage/ProjectProjectLayoutPage";
import SingleCommentPage from "../components/app_components/CommentPage/SingleCommentPage";
import CommentProjectLayoutPage from "../components/app_components/CommentPage/CommentProjectLayoutPage";
//  ~cb-add-import~

const AppRouter = () => {
    return (
        <Routes>
            {/* ~cb-add-unprotected-route~ */}
<Route path="/task/:singleTaskId" exact element={<SingleTaskPage />} />
<Route path="/task" exact element={<TaskProjectLayoutPage />} />
<Route path="/project/:singleProjectId" exact element={<SingleProjectPage />} />
<Route path="/project" exact element={<ProjectProjectLayoutPage />} />
<Route path="/comment/:singleCommentId" exact element={<SingleCommentPage />} />
<Route path="/comment" exact element={<CommentProjectLayoutPage />} />
            <Route element={<ProtectedRoute redirectPath={'/login'} />}>{/* ~cb-add-protected-route~ */}</Route>
        </Routes>
    );
};

const mapState = (state) => {
    const { isLoggedIn } = state.auth;
    return { isLoggedIn };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data)
});

export default connect(mapState, mapDispatch)(AppRouter);
