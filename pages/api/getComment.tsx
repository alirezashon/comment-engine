/** @format */

import { NextApiRequest, NextApiResponse } from 'next'

interface Comment {
	body: string
	author: {
		name: string
	}
	name: string
	// Add any other properties specific to a comment
}

interface IssueResponse {
	fields: {
		comment: {
			comments: Comment[]
		}
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { issueKey } = req.query // Assuming the issue key is passed as a query parameter

	const fields = 'comment'

	const response = await fetch(
		`https://${
			process.env.JIRA_URL
		}/rest/api/2/issue/${issueKey}?fields=${encodeURIComponent(fields)}`,
		{
			headers: {
				Authorization: `Basic ${Buffer.from(
					`${process.env.USER_NAME}:${process.env.API_TOKEN}`
				).toString('base64')}`,
				Accept: 'application/json',
			},
		}
	)

	const data: IssueResponse = await response.json()
	const comments = data.fields.comment.comments
		.map((comment: Comment) => ({
			body: comment.body,
			author: comment.author.name,
		}))
		.filter((comment) => comment.body !== '.')

	res.status(200).json(comments)
}
