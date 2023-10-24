import {Table, TableBody, TableProps} from '@mui/material';
import {ReactNode} from 'react';
import PropertiesTableRow, {PropertiesTableRowProps} from './PropertiesTableRow';

type PropertiesTableProps = TableProps & {
	data?: Map<string, ReactNode>;
	children?: React.ReactElement<PropertiesTableRowProps>[] | React.ReactElement<PropertiesTableRowProps>;
}
export default function PropertiesTable({children, data, size = 'small', ...tableProps}: PropertiesTableProps) {
	return (
		<Table size={size} {...tableProps}>
			<TableBody>
				{children}
				{
					Array.from(data?.entries() || []).map(([key, value]) => (
						<PropertiesTableRow key={key} header={key}>{value}</PropertiesTableRow>
					))
				}
			</TableBody>
		</Table>
	);
}