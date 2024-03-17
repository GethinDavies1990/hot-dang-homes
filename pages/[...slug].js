import client from "client";
import { gql } from "@apollo/client";

export default function Page(props) {
  console.log("Page Props: ", props);
  return <div>page</div>;
}

export const getStaticPaths = async () => {
  const { data } = await client.query({
    query: gql`
      query AllPagesQuery {
        pages {
          nodes {
            uri
          }
        }
      }
    `,
  });

  return {
    paths: data.pages.nodes
      .filer((page) => page.uri !== "/")
      .map((page) => {
        params: {
          slug: page.uri.substring(1, page.uri.length - 1).split("/");
        }
      }),
    fallback: "blocking",
  };
};
