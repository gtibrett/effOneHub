import {TabContext, TabList, TabListProps, TabPanel} from '@mui/lab';
import {Box, Paper, Tab as MuiTab} from '@mui/material';
import {ReactNode, SyntheticEvent, useState} from 'react';

export type TabContent = {
	id: string;
	label: string;
	content: ReactNode;
}

type TabsProps = {
	tabs: TabContent[];
	active?: string;
	color?: TabListProps['indicatorColor'];
}

export default function Tabs({tabs, active = '', color = 'secondary'}: TabsProps) {
	const [activeTab, setActiveTab] = useState<string>(active);
	
	const handleTabChange = (event: SyntheticEvent, newValue: string) => {
		setActiveTab(newValue);
	};
	
	return (
		<Paper variant="outlined" sx={{background: 'transparent'}}>
			<TabContext value={activeTab}>
				<Box sx={{borderBottom: 1, borderColor: 'divider'}}>
					<TabList onChange={handleTabChange} indicatorColor={color}>
						{tabs.map(t => <MuiTab key={t.id} label={t.label} value={t.id}/>)}
					</TabList>
				</Box>
				{tabs.map(t => <TabPanel key={t.id} value={t.id}>{t.content}</TabPanel>)}
			</TabContext>
		</Paper>
	);
}