export const MockWebHookData = {
  callback_url:
    "https://registry.hub.docker.com/u/svendowideit/testhook/hook/2141b5bi5i5b02bec211i4eeih0242eg11000a/",
  push_data: {
    images: [
      "27d47432a69bca5f2700e4dff7de0388ed65f9d3fb1ec645e2bc24c223dc1cc3",
      "51a9c7c1f8bb2fa19bcd09789a34e63f35abb80044bc10196e304f6634cc582c",
    ],
    pushed_at: 1.417566161e9,
    pusher: "trustedbuilder",
    tag: "v1.0",
  },
  repository: {
    comment_count: 0,
    date_created: 1.417494799e9,
    description: "",
    full_description: "Docker Hub based automated build from a GitHub repo",
    is_official: false,
    is_private: true,
    is_trusted: true,
    name: "testhook",
    namespace: "test",
    owner: "tester",
    repo_name: "test/testhook",
    repo_url: "https://registry.hub.docker.com/u/svendowideit/testhook/",
    star_count: 0,
    status: "Active",
  },
};

/**
 * Simple mock docker image
 */
export const MockDockerImage: any = {
  imageName: "test",
  tags: [{ tag: "v1.0" }],
};

/**
 * Simple mock docker image
 */
export const MockDockerImage2: any = {
  imageName: "test2",
  tags: [{ tag: "v1.0" }],
};

/**
 * Docker image with multiple tags
 */
export const MockDockerImage3: any = {
  imageName: "test3",
  tags: [{ tag: "v1.0" }, { tag: "v2.0" }],
};

/**
 * Docker image with empty tag
 */
export const MockDockerImage4: any = {
  imageName: "test4",
  tags: [],
};
