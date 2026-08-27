
import { faker } from "@faker-js/faker";
export default (user,count,authorIds,parentCommentIds,taskIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
author: authorIds[i % authorIds.length],
content: faker.lorem.sentence(""),
createdDate: faker.date.recent(""),
attachment: faker.lorem.sentence(""),
parentComment: parentCommentIds[i % parentCommentIds.length],
task: taskIds[i % taskIds.length],

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
