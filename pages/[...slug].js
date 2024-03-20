import client from "client";
import { gql } from "@apollo/client";
import { cleanAndTransformBlocks } from "./utils/cleanAndTransformBlocks";

export default function Page(props) {
  console.log("Page Props: ", props);
  return <div>page</div>;
}

export const getStaticProps = async (context) => {
  console.log("CONTEXT: ", context);
  const uri = `/${context.params.slug.join("/")}/`;
  console.log("URI: ", uri);
  const { data } = await client.query({
    query: gql`
      query PageQuery($uri: String!) {
        nodeByUri(uri: $uri) {
          ... on Page {
            id
            title
            blocks(postTemplate: false)
          }
        }
      }
    `,
    variables: {
      uri,
    },
  });
  const blocks = cleanAndTransformBlocks(data.nodeByUri.blocks);
  return {
    props: {
      title: data.nodeByUri.title,
      blocks,
    },
  };
};

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
      .filter((page) => page.uri !== "/")
      .map((page) => ({
        params: {
          slug: page.uri.substring(1, page.uri - 1).split("/"),
        },
      })),
    fallback: "blocking",
  };
};
