export const generatePageTitle = (isForm: boolean, isEdit: boolean,isView:boolean, moduleName: string): string => {
  if(isForm  && isView ) return `View ${moduleName} Details`;
  if (isForm && isEdit) return `Update ${moduleName}`;
  if (isForm && !isEdit) return `Create New ${moduleName}`;
  return `${moduleName}s`;
};
