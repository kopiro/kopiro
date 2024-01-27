const List = ({ data, getTitle, getSubtitle, getLink, getDesc, sortingKey }) => {
  if (sortingKey) {
    data.sort((a, b) => (a[sortingKey] > b[sortingKey] ? -1 : 1));
  }
  return data
    .map(
      (el) =>
        `* <span class="title">[${getTitle(el)}](${getLink(el)})</span> - <span class="description">${getDesc(
          el,
        )}</span> - <span class="subtitle">${getSubtitle(el)}</span>`,
    )
    .join("\n");
};

const DevtoList = (data) =>
  List({
    data,
    sortingKey: "created_at",
    getTitle: (e) => e.title,
    getSubtitle: (e) => e.readable_publish_date,
    getDesc: (e) => e.description,
    getLink: (e) => e.url,
  });

const ProjectsList = (data) =>
  List({
    data,
    sortingKey: "year",
    getTitle: (e) => e.title,
    getSubtitle: (e) => e.year,
    getDesc: (e) => e.description,
    getLink: (e) => e.url,
  });

const GithubList = (data) =>
  List({
    data,
    sortingKey: "stargazers_count",
    getTitle: (e) => e.name,
    getSubtitle: (e) => `${e.stargazers_count} stars`,
    getDesc: (e) => e.description,
    getLink: (e) => e.html_url,
  });

module.exports = { DevtoList, ProjectsList, GithubList };
