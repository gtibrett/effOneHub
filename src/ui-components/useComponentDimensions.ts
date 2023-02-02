import {useCallback, useEffect, useState} from 'react';

type ComponentDimensions = {
	width: number;
	height: number;
};

const useComponentDimensionsWithRef = (): { ref: any, dimensions: ComponentDimensions } => {
	const [node, setNode]             = useState<HTMLElement | HTMLDivElement | null>(null);
	const [dimensions, setDimensions] = useState<DOMRect>(new DOMRect());
	
	const ref = useCallback((node: HTMLElement | HTMLDivElement | null) => {
		setNode(node);
	}, []);
	
	useEffect(() => {
		if (node) {
			const handleResize = () => setDimensions(node.getBoundingClientRect());
			
			window.addEventListener('resize', handleResize);
			handleResize();
			
			return () => {
				window.removeEventListener('resize', handleResize);
			};
		}
		else {
			setDimensions(new DOMRect());
		}
	}, [node]);
	
	return {ref, dimensions};
};

export default useComponentDimensionsWithRef;
