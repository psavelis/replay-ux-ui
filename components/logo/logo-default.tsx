import DefautLogoOnlyIcon from './logo-default-only-icon';
import DefautLogoNoIcon from './logo-default-no-icon';

export default function DefautLogo() {
  return (
    <div style={{ textAlign: "center" }}>
      <DefautLogoOnlyIcon />
      <DefautLogoNoIcon tag={true}  />
    </div>
  )
}