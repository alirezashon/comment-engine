/** @format */

import Comment from './getComment'
import { useState } from 'react'
import ExcelJS from 'exceljs'

const ExcelReader = () => {
	const [excelData, setExcelData] = useState([])

	const handleFileChange = async (event) => {
		const file = event.target.files[0]
		try {
			const workbook = new ExcelJS.Workbook()
			await workbook.xlsx.load(file)

			const worksheet = workbook.getWorksheet(1)

			const columnData = worksheet
				.getColumn('A')
				.values.map((cell) => (cell ? cell.toString() : ''))
				.filter((item) => item !== 'null')
			setExcelData(columnData)
		} catch (error) {
			console.error(error)
		}
	}
	console.log(excelData)

	return (
		<>
			{excelData.length === 0 ? (
				<div style={{ margin: '11vh' }}>
					<input
						type='file'
						id='file-input'
						className='file-input'
						onChange={handleFileChange}
					/>
					<label
						htmlFor='file-input'
						className='file-input-label'>
						Select Excel File
					</label>
				</div>
			) : (
				<div style={{ marginTop: '7vh' }}>
					<Comment issueKeys={excelData} />
				</div>
			)}
		</>
	)
}

export default ExcelReader
