const List = ({ data, getTitle, getSubtitle, getLink, getDesc, sortingKey }) => {
  if (sortingKey) {
    data.sort((a, b) => (a[sortingKey] > b[sortingKey] ? -1 : 1));
  }
  return data
    .map(
      (el) =>
        `* <span class="title">[${getTitle(el)}](${getLink(el)})</span> - <span class="description">${getDesc(
          el,
        )}</span>${getSubtitle(el) ? `<span class="subtitle"> (${getSubtitle(el)})</span>` : ""}`,
    )
    .join("\n");
};

const PressList = (data) =>
  List({
    data,
    sortingKey: "created_at",
    getTitle: (e) => e.title,
    getSubtitle: (e) => e.readable_publish_date,
    getDesc: (e) => e.description,
    _getLink: (e) => e.url,
    getLink: (e) => `/press/${e.slug}.md`,
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
    getSubtitle: () => null,
    getDesc: (e) => e.description,
    getLink: (e) => e.html_url,
  });

module.exports = { ProjectsList, GithubList, PressList };
