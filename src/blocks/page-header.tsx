import Header, { Breadcrumb } from '@shared/components/BreadCrumbs';
import { generatePageTitle } from '@shared/utils';

interface IPageHeader {
  pageName: string;
  pageDescription: string;
  isForm: boolean;
  isEdit: boolean;
  isViewMode: boolean;
  breadcrumnArray: { label: string; href?: string }[];
}
const PageHeader = ({ pageName, pageDescription, isForm, isEdit, isViewMode, breadcrumnArray }: IPageHeader) => {
  return (
    <div>
      <Header pageName={generatePageTitle(isForm, isEdit, isViewMode, pageName)} label={pageDescription} />
      <Breadcrumb items={breadcrumnArray} />
    </div>
  );
};

export default PageHeader;
