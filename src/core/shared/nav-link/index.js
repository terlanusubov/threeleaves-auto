import { useRouter } from 'next/router';
import Link from 'next/link';
function NavLink({ href, exact = false, children, activeClass ,...props }) {
    const { pathname } = useRouter();
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    let cls = props.className || ''
    if (isActive) {
        cls += ` ${activeClass}`;
    }
    return (
        <Link href={href}>
            <a className={cls} {...props}>
                {children}
            </a>
        </Link>
    );
}

export default NavLink