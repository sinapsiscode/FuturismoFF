import PropTypes from 'prop-types';

const ResponsiveTable = ({ children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <div className="inline-block min-w-full align-middle">
        {children}
      </div>
    </div>
  );
};

ResponsiveTable.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default ResponsiveTable;