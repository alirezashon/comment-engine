/** @format */

import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

interface IssueComment {
	issueKey: string
	comments: { author: string; body: string }[]
}

interface IssueCommentsProps {
	issueKeys: string[]
}

const IssueComments: React.FC<IssueCommentsProps> = ({ issueKeys }) => {
	const [comments, setComments] = useState<IssueComment[]>([])
	const [progress, setProgress] = useState<number>(0)

	useEffect(() => {
		const fetchComments = async () => {
			const totalKeys = issueKeys.length
			let completed = 0

			const commentsPromises = issueKeys.map(async (issueKey) => {
				const response = await fetch(`/api/getComment?issueKey=${issueKey}`)
				const data = await response.json()

				// Increment the completed count
				completed++
				// Calculate the progress
				const currentProgress = Math.floor((completed / totalKeys) * 100)
				setProgress(currentProgress)
				console.log(currentProgress + ' progress') // Log the current progress
				return { issueKey, comments: data }
			})

			const results: IssueComment[] = await Promise.all(commentsPromises)
			setComments(results)
		}

		fetchComments()
	}, [issueKeys])
	
	console.log(progress + "progress")

	return (
		<>
			{/* {progress > 0 && progress < 100 &&  */}
				<div>
					<div
						
						style={{backgroundColor:'yellow', width: `100%` , height: '10px'}}
					> </div>
				</div>
			{/* } */}
			<div
				className={styles.accordion}
				id='accordionExample'>
				{comments.map(({ issueKey, comments }, index) => (
					<div
						className={styles.accordionItem}
						key={issueKey}>
						<input
							type='checkbox'
							className={styles.accordionCheckbox}
							id={`accordion-${index}`}
						/>
						<label
							className={styles.accordionHeader}
							htmlFor={`accordion-${index}`}>
							{issueKey}
						</label>
						<div className={styles.accordionContent}>
							<table className={styles.table}>
								<thead>
									<tr>
										<th className={styles.goldBackground}>Comment</th>
										<th className={styles.goldBackground}>Author</th>
									</tr>
								</thead>
								<tbody>
									{comments.map(({ author, body }, commentIndex) => (
										<tr
											key={commentIndex}
											className={styles.row}>
											<td className={styles.cell}>{body}</td>
											<td className={styles.cell}>{author}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				))}
			</div>
		</>
	)
}

export default IssueComments
