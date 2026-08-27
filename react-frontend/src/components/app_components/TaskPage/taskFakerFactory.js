
import { faker } from "@faker-js/faker";
export default (user,count,assignedPersonIds,projectIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
title: faker.lorem.sentence(""),
description: faker.lorem.sentence(""),
status: faker.lorem.sentence(""),
dueDate: faker.date.recent(""),
priority: faker.lorem.sentence(""),
assignedPerson: assignedPersonIds[i % assignedPersonIds.length],
project: projectIds[i % projectIds.length],

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
